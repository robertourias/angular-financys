import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Category } from './pages/categories/shared/category.model';

export class inMemoryDatabase implements InMemoryDbService {
  public createDb() {
    const categories: Category[] = [
      { id: 1, name: 'Moradia', description: 'Pagamentos das contas da casa' },
      { id: 2, name: 'Saúde', description: 'Plano de saúde e remédios' },
      { id: 3, name: 'Lazer', description: 'Cinema, parques, praia, etc' },
      { id: 4, name: 'Salários', description: 'Recebimento de salário' },
      { id: 5, name: 'Freelas', description: 'Trabalhos com freelances' }
    ];

    return { categories };
  }
}
