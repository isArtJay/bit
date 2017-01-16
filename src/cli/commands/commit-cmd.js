/** @flow */
import Command from '../command';
import { commitAction } from '../../api';
import Component from '../../consumer/bit-component';

export default class Export extends Command {
  name = 'commit <id> <message>';
  description = 'commit a bit to the local scope and add a log message';
  alias = 'c';
  opts = [
  ];

  action([id, message]: [string, string]): Promise<any> {
    return commitAction({ id, message });
  }

  report(c: Component): string {
    return `bit ${c.box}/${c.name} commited succesfully`;
    // return chalk.green(`exported bit "${name}" from inline to external`);
  }
}
