export class BrandDTO {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

export class BrandCreateDTO {
  name: string;
  status: number = 1;

  constructor(name: string) {
    this.name = name;
  }
}
