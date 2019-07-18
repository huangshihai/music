import musicApiContructor from '@huangsh/music-api/dist/app.electron'
import { remote } from 'electron'

const api = musicApiContructor(remote.getGlobal('nodeAdapter'))

export default {
    ...api,
    async searchSong(key, pageNo = 0) {
        try {
            let data = await api.searchSong(key, pageNo)
            if (data.status) {
                data = data.data
                return {
                    status: true,
                    data: data
                }
            } else {
                return data
            }
        } catch (e) {
            console.warn(e)
            return {
                status: false,
                msg: e.msg || '搜索失败，请重试',
                log: e,
            }
        }
    },
    async getTopList(id) {
        const data = await api.getTopList(id)
        if (data.status) {
            for (let item of data.data.list) {
                item.vendor = 'netease'
                item.songId = item.id
            }
        }
        return data
    },
}