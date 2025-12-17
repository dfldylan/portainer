import { BROWSER_OS_PLATFORM } from '@CE/react/constants';

import { Tooltip } from '@@CE/Tip/Tooltip';

const editorConfig = {
  mac: {
    tooltip: (
      <>
        <div>Within the console:</div>
        <div>Cmd+C - Copy</div>
        <div>Cmd+V - Paste</div>
        <div>or right-click -&gt; Copy/Paste</div>
      </>
    ),
  },

  lin: {
    tooltip: (
      <>
        <div>Within the console:</div>
        <div>Ctrl+Insert - Copy</div>
        <div>Shift+Insert - Paste</div>
        <div>or right-click -&gt; Copy/Paste</div>
      </>
    ),
  },

  win: {
    tooltip: (
      <>
        <div>Within the console:</div>
        <div>Ctrl+Insert - Copy</div>
        <div>Shift+Insert - Paste</div>
        <div>or right-click -&gt; Copy/Paste</div>
      </>
    ),
  },
} as const;

export function TerminalTooltip() {
  return <Tooltip message={editorConfig[BROWSER_OS_PLATFORM].tooltip} />;
}
