import { Category } from '../../categories/shared/category.model';

export class EntryModel {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public type?: string,
    public amount?: string,
    public date?: string,
    public paid?: number,
    public categoryId?: number,
    public category?: Category
  ) {}

  static types = {
    expense: 'Despesa',
    revenue: 'Receita'
  }

  get paidText() {
    return this.paid? 'Pago' : 'Pendente';
  }
}
