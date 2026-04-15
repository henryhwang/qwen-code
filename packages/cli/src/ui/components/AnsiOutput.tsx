/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type React from 'react';
import { Text } from 'ink';
import type {
  AnsiLine,
  AnsiOutput,
  AnsiToken,
} from '@qwen-code/qwen-code-core';

const DEFAULT_HEIGHT = 24;

interface AnsiOutputProps {
  data: AnsiOutput;
  availableTerminalHeight?: number;
}

export const AnsiOutputText: React.FC<AnsiOutputProps> = ({
  data,
  availableTerminalHeight,
}) => {
  const lastLines = data.slice(
    -(availableTerminalHeight && availableTerminalHeight > 0
      ? availableTerminalHeight
      : DEFAULT_HEIGHT),
  );
  return lastLines.map((line: AnsiLine, lineIndex: number) => {
    if (line.length === 0) return <Text key={lineIndex} />;

    const groupedTokens: Array<{ tokens: AnsiToken[] }> = [];
    let currentGroup: AnsiToken[] = [];

    line.forEach((token) => {
      if (currentGroup.length === 0) {
        currentGroup.push(token);
      } else {
        const last = currentGroup[currentGroup.length - 1];
        if (
          token.fg === last.fg &&
          token.bg === last.bg &&
          token.bold === last.bold &&
          token.italic === last.italic &&
          token.underline === last.underline &&
          token.dim === last.dim &&
          token.inverse === last.inverse
        ) {
          currentGroup.push(token);
        } else {
          groupedTokens.push({ tokens: currentGroup });
          currentGroup = [token];
        }
      }
    });
    if (currentGroup.length > 0) {
      groupedTokens.push({ tokens: currentGroup });
    }

    return (
      <Text key={lineIndex}>
        {groupedTokens.map((group, groupIndex) => {
          const first = group.tokens[0];
          const combinedText = group.tokens.map((t) => t.text).join('');
          return (
            <Text
              key={groupIndex}
              color={first.inverse ? first.bg : first.fg}
              backgroundColor={first.inverse ? first.fg : first.bg}
              dimColor={first.dim}
              bold={first.bold}
              italic={first.italic}
              underline={first.underline}
            >
              {combinedText}
            </Text>
          );
        })}
      </Text>
    );
  });
};
