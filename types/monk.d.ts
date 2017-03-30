declare module "monk" {
  function m(database: string|string[], options?: object, callback?: Function): m.Manager

  module m {
    export interface Manager {
      (database: string|string[], options?: object, callback?: Function): void;

      close(force?: boolean, callback?: Function): Promise<void>;

      get(collection: string, options?: object): Collection;
      create(name: string, creationOptions?: object, options?: object): Collection;
    }

    export interface Collection {
      aggregate(pipeline: any[], options?: object, callback?: Function): Promise<any>;
      bulkWrite(operations: any[], options?: object, callback?: Function): Promise<any>;
      count(query: string|object, options?: object, callback?: Function): Promise<number>;
      distinct(field: string, query?: string|object, options?: object, callback?: Function): Promise<any>;
      drop(callback?: Function): Promise<void>;
      dropIndex(fields: string|object|string[], options?: object, callback?: Function): Promise<void>;
      dropIndexes(callback?: Function): Promise<void>;
      ensureIndex(fieldOrSpec: string|object|string[], options?: object, callback?: Function): Promise<any>
      find(query: string|object, options?: object|string|string[], callback?: Function): Promise<any>
      findOne(query: string|object, options?: object|string|string[], callback?: Function): Promise<object>
      findOneAndDelete(query: string|object, options?: object|string|string[], callback?: Function): Promise<object>
      findOneAndUpdate(query: string|object, update: object, options?: object|string|string[], callback?: Function): Promise<object>
      group(keys: object|object[]|Function, condition: object, initial: object, reduce: Function, finalize?: Function, command?: boolean, options?: object, callback?: Function): Promise<any>
      indexes(callback?: Function): Promise<any>
      insert(docs: object|object[], options?: object, callback?: Function): Promise<any>
      remove(query: object|string, options?: object, callback?: Function): Promise<any>
      update(query: object|string, update: object, options?: object, callback?: Function): Promise<any>
    }

    export interface ObjectId {}

    export function id(id: string): ObjectId;
  }

  export = m;
}