import type { Trader } from '#src/types';

type Props = Pick<Trader, 'avatar' | 'name' | 'lastName'>;

export const AccountInfo = ({ avatar, name, lastName }: Props) => (
  <div className="flex align-center">
    <img className="push-sm-right" src={avatar} alt="avatar" width={48} height={48} />
    <div className="flex direction-column align-start">
      <span className="brand-text-small--light">{name}</span>
      <span className="brand-primary-text">{lastName}</span>
    </div>
  </div>
);
