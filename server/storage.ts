// Storage interface for the school evaluation system
// Modify this interface with any CRUD methods you need

export interface IStorage {
  // Add CRUD methods here as needed
}

export class MemStorage implements IStorage {
  constructor() {
    // Initialize storage as needed
  }
}

export const storage = new MemStorage();
