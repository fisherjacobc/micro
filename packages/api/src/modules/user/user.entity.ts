import { Collection, Entity, OneToMany, OneToOne, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { File } from '../file/file.entity';
import { generateContentId } from '../../helpers/generate-content-id.helper';
import { Invite } from '../invite/invite.entity';
import { Exclude } from 'class-transformer';

@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey()
  id: string = generateContentId();

  @Property({ unique: true, index: true })
  username: string;

  @Property()
  permissions: number = 0;

  @Property({ hidden: true })
  @Exclude()
  password: string;

  @Property({ hidden: true })
  secret: string;

  @OneToOne({ nullable: true })
  invite?: Invite;

  @Property()
  tags: string[] = [];

  @OneToMany(() => File, (file) => file.owner, { orphanRemoval: true })
  @Exclude()
  files = new Collection<File>(this);

  [OptionalProps]: 'permissions' | 'tags';
}
