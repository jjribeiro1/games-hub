import {
  BsAndroid2,
  BsWindows,
  BsPlaystation,
  BsXbox,
  BsBrowserChrome,
  BsNintendoSwitch,
} from 'react-icons/bs';
import { MdPhoneIphone } from 'react-icons/md';
import { Game } from '@/types/game';

export default function useGameIcons(game: Game) {
  const gameIcons = () => {
    const platforms = game.platform;
    const platformKeys = new Set<string>();
    const iconsMap = new Map<string, React.JSX.Element>([
      ['pc', <BsWindows key={'pc'} className="text-mine-shaft-400 w-4 h-4" />],
      ['playstation', <BsPlaystation key={'playstation'} className="text-mine-shaft-400 w-5 h-5" />],
      ['xbox', <BsXbox key={'xbox'} className="text-mine-shaft-400 w-4 h-4" />],
      ['nintendo-switch', <BsNintendoSwitch key={'nintendo-switch'} className="text-mine-shaft-400 w-4 h-4" />],
      ['android', <BsAndroid2 key={'android'} className="text-mine-shaft-400 w-4 h-4" />],
      ['ios', <MdPhoneIphone key={'ios'} className="text-mine-shaft-400 w-4 h-4" />],
      ['web-browser',<BsBrowserChrome key={'web-browser'} className="text-mine-shaft-400 w-4 h-4" /> ]
    ]);
    const doublePlatforms = ['playstation-4', 'playstation-5', 'xbox-one', 'xbox-series-x'];

    platforms.forEach((platform) => {
      if (doublePlatforms.includes(platform)) {
        if (platform === 'xbox-one' || platform === 'xbox-series-x') {
          platformKeys.add('xbox');
        }
        if (platform === 'playstation-4' || platform === 'playstation-5') {
          platformKeys.add('playstation');
        }
      } else {
        platformKeys.add(platform);
      }
    });
    return Array.from(platformKeys.values()).map((key) => iconsMap.get(key));
  };

  return {
    gameIcons,
  };
}
