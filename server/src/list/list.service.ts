import { Injectable } from '@nestjs/common';
import { List } from 'src/entities/list.entity';
import { Movie } from 'src/entities/movie.entity';
import { ListItems, ListMovieItem } from 'src/shared/api.interfaces';

@Injectable()
export class ListService {
  async insertItems(items: ListItems, list: List) {
    for (const key in items) {
      if (items.hasOwnProperty(key)) {
        this.saveAndInsertItem(
          list,
          await this.convertItems(items, key, list),
          key as keyof ListItems
        );
      }
    }
  }

  private async convertItems(_items: ListItems, key: string, list: List) {
    const items = _items[key as keyof ListItems];
    const res: Movie[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      switch (key) {
        case 'movies':
          res.push(await this.convertToMovie(item, list));
      }
    }
    return res;
  }

  private async convertToMovie(item: ListMovieItem, list: List) {
    const movie = await Movie.findOne({ where: { name: item.name }, select: ['id'] });
    if (!movie) {
      const newMovie = Movie.create({
        description: item.description,
        name: item.name,
        lists: [list]
      });

      await newMovie.save();
      return newMovie;
    }

    return movie;
  }

  private async saveAndInsertItem(list: List, items: Movie[], field: 'movies') {
    const filteredItems = Object.values(
      items.reduce((acc, current) => {
        acc[current.id] = current;
        return acc;
      }, {}) as Movie[]
    );

    if (list[field]) {
      list[field].push(...filteredItems);
    } else {
      list[field] = [...filteredItems];
    }

    await list.save();
  }
}
