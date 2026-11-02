// project-imports
import { isValidDatabaseKey } from 'utils/isValidDatabaseKey';
import { ApiError, HttpClient } from './http-client';

// ==============================|| CRUD FACTORY - REALTIME DATABASE ||============================== //

/** valor gravado no banco: o `id` é a chave do registro, não um campo dele */
type Stored<Type> = Omit<Type, 'id'>;

/** o servidor troca este valor pela hora dele ao gravar: o relógio do navegador não entra */
const SERVER_TIMESTAMP = { '.sv': 'timestamp' } as const;

interface CrudOptions<Type> {
  /** ordem da lista devolvida por `all` (o banco devolve os registros por chave) */
  compare?: (a: Type, b: Type) => number;
}

export function crudFactory<Type extends { id: string }, InputType extends object, UpdateType extends object = Partial<InputType>>(
  endpoint: string,
  { compare }: CrudOptions<Type> = {}
) {
  const withId = (id: string, stored: Stored<Type>) => ({ ...stored, id }) as unknown as Type;

  const pathOf = (id: string) => {
    // o id pode vir da URL da página: nunca deixa que ele mude o caminho da chamada
    if (!isValidDatabaseKey(id)) throw new ApiError('not-found', 'Identificador inválido');
    return `${endpoint}/${id}`;
  };

  return {
    async all(): Promise<Type[]> {
      const stored = await HttpClient.get<Record<string, Stored<Type>> | null>(endpoint);
      const list = Object.entries(stored ?? {}).map(([id, value]) => withId(id, value));
      return compare ? list.sort(compare) : list;
    },
    async get({ id }: { id: string }): Promise<Type> {
      const stored = await HttpClient.get<Stored<Type> | null>(pathOf(id));
      if (!stored) throw new ApiError('not-found', 'Registro não encontrado');
      return withId(id, stored);
    },
    async create(data: InputType): Promise<{ id: string }> {
      const { name } = await HttpClient.post<{ name: string }>(endpoint, {
        ...data,
        createdAt: SERVER_TIMESTAMP,
        updatedAt: SERVER_TIMESTAMP
      });
      return { id: name };
    },
    async update({ id, ...input }: UpdateType & { id: string }): Promise<{ id: string }> {
      await HttpClient.patch(pathOf(id), { ...input, updatedAt: SERVER_TIMESTAMP });
      return { id };
    },
    async delete({ id }: { id: string }): Promise<boolean> {
      await HttpClient.delete(pathOf(id));
      return true;
    }
  };
}
