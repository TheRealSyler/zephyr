import { styler } from '@sorg/log';
import { HttpStatus } from '@nestjs/common';

interface LogRequestData {
  method: string;
  url: string;
  statusCode: number;
  time?: number;
  headersSent?: boolean;
}

const colors = {
  symbol: '#666',
  text: '#aaa',
  url: '#0af',
  number: '#0f9',
  GET: '#0af',
  HEAD: '#eee',
  POST: '#0f9',
  ṔUT: '#fe2',
  DELETE: '#f26',
  CONNECT: '#eee',
  OPTIONS: '#eee',
  TRACE: '#eee',
  PATCH: '#eee',
  STATUSES: {
    '1-199': '#0af',
    '200-299': '#0f8',
    '300-399': '#afa',
    '400-499': '#f26',
    '500-599': '#f62'
  }
};

export const logRequest = ({
  method,
  statusCode,
  url,
  time,
  headersSent = true
}: LogRequestData) => {
  console.log(
    `${getText('[')}${getMethod(method)}${getText(']')}${colon} ${styler(
      url,
      colors.url
    )} ${getStatus(statusCode)} ${getTime(time)} ${getHeadersSent(headersSent)}`
  );
};

const getText = (text: string) => styler(text, colors.text);

const colon = styler(':', colors.symbol);

function getTime(time?: number) {
  if (time) {
    return `${getText('Took')}${colon} ${styler(String(Date.now() - time), colors.number)}${styler(
      'ms',
      colors.text
    )}`;
  }
  return '';
}

function getStatus(status: number) {
  return `${getText('Status')}${colon} ${(() => {
    let key: keyof typeof colors['STATUSES'] = '500-599';
    if (status <= 199) {
      key = '1-199';
    } else if (status >= 200 && status <= 299) {
      key = '200-299';
    } else if (status >= 300 && status <= 399) {
      key = '300-399';
    } else if (status >= 400 && status <= 499) {
      key = '400-499';
    }
    return styler(`${status} ${HttpStatus[status]}`, colors.STATUSES[key]);
  })()}`;
}

function getHeadersSent(headersSent: boolean) {
  return headersSent
    ? ''
    : styler('Headers NOT Sent (pro tip, there might be a bug.)', colors.DELETE);
}

function getMethod(method: string) {
  return styler(method, colors[method]);
}
