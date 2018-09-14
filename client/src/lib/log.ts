function createLogger(logLevel: string) {
  return function(message: string, ...args: any[]) {
    console.log(`[${logLevel}] ${message}`, ...args)
  }
}

const log = {
  error: createLogger('ERROR'),
  warn: createLogger('WARN'),
  info: createLogger('INFO'),
  debug: createLogger('DEBUG'),
  trace: createLogger('TRACE'),
}

export default log
