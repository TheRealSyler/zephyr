import { h, Component } from 'preact';
import './navbar.sass';

import NavbarItemComponent from './navbarItem';
import { LogOut } from '../../auth';
import { Clamp } from '../../shared/utils.math';
import IconComponent from '../icon/icon';

interface NavbarComponentProps {}
interface NavbarComponentState {
  isDragging: boolean;
  isHidden: boolean;
}

interface AnimateLoopParams {
  open: boolean;
  time: number;
  multiplier: number;
  startTime: number;
  root: HTMLElement;
  startPos: number;
}

class NavbarComponent extends Component<NavbarComponentProps, NavbarComponentState> {
  maxPos = 0;
  minPos = -200;
  maxAnimTime = 120;
  constructor(props: NavbarComponentProps) {
    super(props);

    this.state = {
      isDragging: false,
      isHidden: false
    };
  }

  private animate(currentPos: number | null, open: boolean) {
    let multiplier = 1;
    if (currentPos !== null) {
      const distance = this.minPos - currentPos;
      const minPos = Math.abs(this.minPos);
      multiplier = 1 - Math.abs(minPos / 2 + distance) / 100;
    }
    const root = document.documentElement;

    this.animateLoop({
      startPos: +root.style.getPropertyValue('--nav-pos').replace(/px$/, ''),
      open,
      startTime: Date.now(),
      root,
      multiplier,
      time: this.maxAnimTime * multiplier
    });
  }

  private animateLoop({ open, time, startTime, root, multiplier, startPos }: AnimateLoopParams) {
    time = this.maxAnimTime * multiplier - (Date.now() - startTime);
    if (time >= 0) {
      const animPosition = time / this.maxAnimTime;

      const newPos = open
        ? -(animPosition * (this.maxPos - startPos))
        : (1 - animPosition) * this.minPos * 0.5 + this.minPos * 0.5;

      root.style.setProperty('--nav-pos', Clamp(this.minPos, this.maxPos, newPos) + 'px');

      requestAnimationFrame(() =>
        this.animateLoop({
          root,
          open,
          time,
          multiplier,
          startTime,
          startPos
        })
      );
    } else {
      root.style.setProperty('--nav-pos', (open ? this.maxPos : this.minPos) + 'px');

      this.setState({ isHidden: !open });
    }
  }

  private readonly endDrag = () => {
    if (this.state.isDragging) {
      const root = document.documentElement;
      const navPos = +root.style.getPropertyValue('--nav-pos').replace(/px$/, '');

      let isHidden = false;
      if (navPos <= this.minPos) {
        isHidden = true;
      }

      this.animate(navPos, navPos > this.minPos * 0.5);

      this.setState({ isDragging: false, isHidden });
    }
  };
  private readonly startDrag = () => this.setState({ isDragging: true });

  private readonly moveDrag = (e: MouseEvent | TouchEvent) => {
    if (this.state.isDragging) {
      const root = document.documentElement;
      const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;

      root.style.setProperty(
        '--nav-pos',
        Clamp(this.minPos, this.maxPos, -1 * (200 - clientX)) + 'px'
      );

      const navPos = +root.style.getPropertyValue('--nav-pos').replace(/px$/, '');
      let isHidden = false;
      if (navPos <= this.minPos) {
        isHidden = true;
      }

      if (this.state.isHidden !== isHidden) {
        this.setState({ isHidden });
      }
    }
  };

  render() {
    return (
      <nav class="nav">
        {/* <div style="z-index: 10020434242; top: 0; left: 0;background: red; width: 100px; height: 20px; position: absolute;"></div> */}

        <div
          class="nav-content"
          onTouchStart={this.startDrag}
          onTouchEnd={this.endDrag}
          onTouchMove={this.moveDrag}
        >
          <div class="nav-spacer-small"></div>
          <NavbarItemComponent icon="home" text="Home" link="/home" />
          <NavbarItemComponent icon="github" text="Test" link="/test" />

          <div class="nav-spacer"></div>
          <NavbarItemComponent
            icon="logout"
            flipIconX={true}
            text="Logout"
            onClick={LogOut}
            link="/logout"
          />
          <div class="nav-spacer-small"></div>
        </div>
        <div
          class={this.state.isDragging ? 'nav-drag-active' : 'nav-drag'}
          onMouseUp={this.endDrag}
          onMouseLeave={this.endDrag}
          onMouseMove={this.moveDrag}
          onMouseDown={this.startDrag}
          onTouchStart={this.startDrag}
          onTouchEnd={this.endDrag}
          onTouchMove={this.moveDrag}
        ></div>
        <div class={this.state.isHidden ? 'nav-overlay hidden' : 'nav-overlay'}></div>
        <div
          class={this.state.isHidden ? 'nav-show-btn' : 'nav-show-btn hidden'}
          onClick={() => this.animate(null, true)}
        >
          <IconComponent name="bars" />
        </div>
      </nav>
    );
  }
}

export default NavbarComponent;
