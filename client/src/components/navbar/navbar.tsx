import { h, Component } from 'preact';
import './navbar.sass';

import NavbarItemComponent from './navbarItem';
import { LogOut } from '../../auth';
import { Clamp } from '../../shared/utils.math';

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

    let isHidden = false;
    const root = document.documentElement;
    if (window.innerWidth < 1000 && root) {
      isHidden = true;
      root.style.setProperty('--nav-pos', '-200px');
    }

    this.state = {
      isDragging: false,
      isHidden,
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
      time: this.maxAnimTime * multiplier,
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
          startPos,
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
      <nav class={this.state.isHidden ? 'nav hidden' : 'nav'}>
        <div
          onClick={() => this.animate(null, false)}
          class={this.state.isHidden ? 'nav-overlay hidden' : 'nav-overlay'}
        ></div>
        <div
          class="nav-content"
          onTouchStart={this.startDrag}
          onTouchEnd={this.endDrag}
          onTouchMove={this.moveDrag}
        >
          <div class="nav-buttons">
            <div
              title={this.state.isHidden ? 'Show Navbar' : 'Hide Navbar'}
              class={this.state.isHidden ? 'nav-btn active' : 'nav-btn'}
              onClick={() => this.animate(null, this.state.isHidden)}
            >
              <div class={this.state.isHidden ? 'nav-show-close' : 'nav-show-close active'}></div>
            </div>
          </div>

          <div class="nav-line"></div>
          <NavbarItemComponent icon="home" text="Home" link="/home" />
          <NavbarItemComponent icon="list" text="List" link="/list" />

          <div class="spacer"></div>
          <NavbarItemComponent
            icon="github"
            text="Source Code"
            link="https://github.com/TheRealSyler/zephyr"
          />

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
      </nav>
    );
  }
}

export default NavbarComponent;
