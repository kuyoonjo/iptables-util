import { Chain } from "./Chain";
import { Rule } from "./Rule";

export class Iptables {
  private _chains: Chain[];
  private _rules: Rule[];
  private _lines: string[];
  private _commitLineIndex = 0;
  private _source: string;
  constructor(
    source: string,
  ) {
    this._source = source;
    this._lines = source.split('\n');
    this._chains = [];
    this._rules = [];
    for (let i = 0; i < this._lines.length; ++i) {
      const line = this._lines[i];
      let m = line.match(/^:(\w+)/);
      if (m) {
        const chain = new Chain(m[1], i, line);
        this._chains.push(chain);
        continue;
      }
      m = line.match(/^-A\s(\w+)/);
      if (m) {
        const rule = new Rule(m[1], i, line);
        this._rules.push(rule);
        continue;
      }
      m = line.match(/^COMMIT/);
      if (m) {
        this._commitLineIndex = i;
        continue;
      }
    }
  }

  public get source() {
    return this._source;
  }

  public get output() {
    for (const c of [...this._chains, ...this._rules]) {
      this._lines[c.lineIndex] = c.content;
      if (c.removed) {
        this._lines[c.lineIndex] = '# ' + this._lines[c.lineIndex];
      }
    }
    return this._lines.join('\n');
  }

  public get chains() {
    return this._chains.filter(c => !c.removed);
  }

  public get rules() {
    return this._rules.filter(r => !r.removed);
  }

  public removeChainByName(name: string) {
    const c = this._chains.find(x => x.name === name);
    if (c) {
      c['_removed'] = true;
      this.removeRulesByChainName(name);
    }
  }

  public removeRulesByChainName(chainName: string) {
    const rs = this._rules.filter(x => x.chainName === chainName);
    for (const r of rs) {
      r['_removed'] = true;
    }
  }

  public addChain(name: string) {
    const i = this._chains[this._chains.length - 1].lineIndex + 1;
    const chain = new Chain(name, i, `:${name} - [0:0]`);
    this._chains.push(chain);
    this._lines.splice(i, 0, chain.content);
    for (const r of this._rules) {
      r['_lineIndex']++;
    }
    this._commitLineIndex++;
  }

  public addRule(chainName: string, content: string) {
    const i = this._commitLineIndex;
    const rule = new Rule(chainName, i, content);
    this._rules.push(rule);
    this._lines.splice(i, 0, content);
    this._commitLineIndex++;
  }

  public addRuleAtFront(chainName: string, content: string) {
    const i = this._rules[0].lineIndex;
    const rule = new Rule(chainName, i, content);
    for (const r of this._rules) {
      r['_lineIndex']++;
    }
    this._rules.unshift(rule);
    this._lines.splice(i, 0, content);
    this._commitLineIndex++;
  }
}