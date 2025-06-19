import { CodRepository, ICODRepository } from "../repositories/cod.repository";
import { TCODData } from "../schema/cod";

class CODService {
  private static instance: CODService;
  private readonly repository: ICODRepository;

  private constructor() {
    this.repository = CodRepository;
  }

  static getInstance(): CODService {
    if (!CODService.instance) {
      CODService.instance = new CODService();
    }
    return CODService.instance;
  }

  /** Inserts multiple cods into the database */
  async insertMultiple(cods: TCODData[]): Promise<void> {
    return this.repository.insertMultiple(cods);
  }

  async deleteAllCods() {
    return this.repository.deleteAllCods();
  }
}

export type ICODService = CODService;
// Export the singleton instance
export const CodService = CODService.getInstance();
