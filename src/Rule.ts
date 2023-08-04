export class Rule {
  private _chainName: string;
  private _lineIndex: number;
  private _content: string;
  private _removed = false;

  constructor(
    chainName: string,
    lineIndex: number,
    content: string,
  ) {
    this._chainName = chainName;
    this._lineIndex = lineIndex;
    this._content = content;
  }

  public get chainName() {
    return this._chainName;
  }

  public get content() {
    return this._content;
  }

  public get lineIndex() {
    return this._lineIndex;
  }

  public get removed() {
    return this._removed;
  }
}