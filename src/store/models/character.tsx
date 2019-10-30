export class Character {
  id: number;
  name: string;
  status: string;
  imageUrl: string;

  constructor(id: number, name: string, status: string, imageUrl: string) {
    this.id = id
    this.name = name
    this.status = status
    this.imageUrl = imageUrl
  }
}

export class CharactersInfo {
  characters: Character[];
  next: string;

  constructor(characters: Character[], next: string) {
    this.characters = characters
    this.next = next
  }
}