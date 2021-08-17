import Mongo from './mongo';
import Redis from './redis';


class DatabaseWrapper {
  /**
   * @description :: select model for run query
   * @param {string} modelName 
   * @returns 
   */
  static model(modelName) {
    return {
      create: async (data) => await this.create(modelName, data),
      get: async (where) => await this.get(modelName, where),
      getOne: async (where) => await this.getOne(modelName, where),
      update: async (where, data, option) => await this.update(modelName, where, data, option),
      delete: async (where) => await this.delete(modelName, where)
    };
  }


  /**
   * @description :: create document
   * @param {object} data 
   * @returns 
   */
  static async create(modelName, data) {
    try {
      const result = await Mongo.model(modelName).create(data);
      await Redis.model(modelName).set('key', data);
      return result;
    } catch (err) {
      throw Error(err);
    }
  }

  /**
   * @description :: get documents
   * @param {object} where 
   */
  static async get(modelName, where) {
    try {
      await Redis.model(modelName).find(where);
      await Mongo.model(modelName).find(where);
    } catch (err) {
      throw Error(err);
    }
  }

  /**
   * @description :: get one document
   * @param {object} where 
   */
  static async getOne(modelName, where) {
    try {
      const result = await Models[modelName].findOne(where);
      return result.lenght ? result[0] : false;
    } catch (err) {
      throw Error(err);
    }
  }

  /**
   * @description :: update One document
   * @param {object} where 
   * @param {object} data 
   */
  static async update(modelName, where, data, option = {}) {
    try {
      return await Models[modelName].updateOne(where, { $set: data }, { new: true, ...option });
    } catch (err) {
      throw Error(err);
    }
  }

  /**
   * @description :: remove one document
   * @param {object} where 
   */
  static async deleteOne(modelName, where) {
    try {
      return await Models[modelName].remove(where);
    } catch (err) {
      throw Error(err);
    }
  }
}

export default DatabaseWrapper;