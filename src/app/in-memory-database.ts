import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Category } from './pages/categories/shared/category.model';
import { EntryModel } from './pages/entries/shared/entry.model';

export class InMemoryDatabase implements InMemoryDbService {
  createDb() {
    const categories: Category[] = [
      { id: 1, name: 'Moradia', description: 'Pagamentos das contas da casa' },
      { id: 2, name: 'Saúde', description: 'Plano de saúde e remédios' },
      { id: 3, name: 'Lazer', description: 'Cinema, parques, praia, etc' },
      { id: 4, name: 'Salários', description: 'Recebimento de salário' },
      { id: 5, name: 'Freelas', description: 'Trabalhos com freelances' },
    ];

    const entries: EntryModel[] = [
      { id: 1, name: 'Gás de Cozinha', categoryId: categories[0].id, category: categories[0], paid: true, date: '14/10/2018', amount: '70,80', type: 'expense', description: 'Qaulquer coisa' } as EntryModel
    ]

    return { categories, entries };
  }
}
