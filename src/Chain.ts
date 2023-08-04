export class Chain {
  private _name: string;
  private _lineIndex: number;
  private _content: string;
  private _removed = false;

  constructor(
    name: string,
    lineIndex: number,
    content: string,
  ) {
    this._name = name;
    this._lineIndex = lineIndex;
    this._content = content;
  }

  public get name() {
    return this._name;
  }

  public get lineIndex() {
    return this._lineIndex;
  }

  public set name(v: string) {
    this._content = this._content.replace(this._name, v);
    this._name = v;
  }

  public get content() {
    return this._content;
  }

  public get removed() {
    return this._removed;
  }
}