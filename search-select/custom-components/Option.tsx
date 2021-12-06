import React from 'react';
import { components } from 'react-select';

import CheckmarkIcon from '../../../components/svg-components/checkmark-icon/CheckmarkIcon';
import DiscordIcon from '../../../components/svg-components/discord-icon/DiscordIcon';
import DriveIcon from '../../../components/svg-components/drive-icon/DriveIcon';
import GmailIcon from '../../../components/svg-components/gmail-icon/GmailIcon';
import SlackIcon from '../../../components/svg-components/slack-icon/SlackIcon';
import TeamworkIcon from '../../../components/svg-components/teamwork-icon/TeamworkIcon';
import TwitchIcon from '../../../components/svg-components/twitch-icon/TwitchIcon';

export const getSvgIcon = (
  icon: 'drive' | 'gmail' | 'teamwork' | 'slack' | 'discord' | 'twitch'
): any => {
  switch (icon) {
    case 'drive':
      return <DriveIcon width={18} height={17} />;
    case 'gmail':
      return <GmailIcon width={18} height={14} />;
    case 'teamwork':
      return <TeamworkIcon width={16} height={16} />;
    case 'slack':
      return <SlackIcon width={17} height={17} />;
    case 'discord':
      return <DiscordIcon width={19} height={14} />;
    case 'twitch':
      return <TwitchIcon width={15} height={17} />;
    default:
      return;
  }
};

const Option: React.FC<any> = (option) => {
  return (
    <components.Option {...option}>
      <div className='flex items-center'>
        <div className='bg-s0gray-11 w-6 h-6 rounded flex justify-center items-center mr-2'>
          {getSvgIcon(option.value)}
        </div>
        <div className='flex-grow'>{option.children}</div>
        {option.isSelected && <CheckmarkIcon />}
      </div>
    </components.Option>
  );
};

export default Option;
