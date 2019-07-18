import autoUpdater from '@suen/electron-updater'

export default function initUpdater() {
    const updater = autoUpdater({
        type: 'github',
        options: {
            username: 'huangshihai',
            repo: 'music',
            log: true // will emit log event
        }
    })
    updater.__judgeUpdater = async (includeLinux = false) => {
        try {
            if(includeLinux) {
                await updater.checkForUpdatesAndNotify()
            } else {
                const needUpdate = await updater.checkUpdate()
                if (!needUpdate) return false
                // osx 或 windows 使用默认的更新
                if (process.platform === 'darwin' || process.platform === 'win32') {
                    updater.updateAvailableCallback()
                } else {
                    global.mainWindow.webContents.send('update-alert')
                }
            }
        } catch (e) {
            console.warn(e)
        }
        return true
    }
    global.updater = updater
}