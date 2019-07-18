<template>
    <div :class="s.searchResult">
        <div :class="s.top">
            <a :class="s.title"><span>搜索</span><span :class="s.keyword">{{keywords}}</span></a>
            <el-checkbox v-model="filter.netease">网易云</el-checkbox>
            <el-checkbox v-model="filter.qq">QQ音乐</el-checkbox>
            <el-checkbox v-model="filter.xiami">虾米音乐</el-checkbox>
            <el-checkbox v-model="filter.cp">包含无版权歌曲</el-checkbox>
        </div>
        <DataTable :data="result"
                   :total="total"
                   :pageSize="pageSize"
                   :loading="loading"
                   :pagination="true"
                   @change="handleCurrentChange"
                   style="padding: 0 12px"
                   element-loading-text="拼命加载中..."
        ></DataTable>
    </div>
</template>
<script>
    import {mapState, mapActions} from 'vuex'
    import eventBus from '@/eventBus/searchResult'

    export default {
        data() {
            return {
                filter: {
                    cp: true,  // 是否包含无版权歌曲
                    netease: false,
                    xiami: false,
                    qq: true,
                },
                total: 0,
                pageSize: 30
            }
        },
        computed: {
            ...mapState('search', ['keywords', 'loading']),
            result() {
                // 为了避免深拷贝一份数据 此处使用递归filter
                let temp = JSON.parse(JSON.stringify(eventBus.searchResult))
                if (!this.filter.netease) {
                    delete temp['netease']
                }
                if (!this.filter.qq) {
                    delete temp['qq']
                }
                if (!this.filter.xiami) {
                    delete temp['xiami']
                }
                if (!this.filter.cp) {
                    Object.keys(temp).forEach(key => {
                        let cur = temp[key].songs
                        temp[key].songs = cur.filter(item => !item.cp)
                    })
                }
                let dealFuncs = []
                let count = 0
                let total = 0
                Object.keys(temp).forEach(key => {
                    total += temp[key].total
                    count++
                    let cur = temp[key].songs
                    cur.forEach(item => {
                        dealFuncs.push({
                            ...item,
                            songId: item.id,
                            vendor: key,
                        })
                    })
                })
                this.total = total
                this.pageSize = 30 * count
                return dealFuncs
            }
        },
        methods: {
            ...mapActions('play', ['play']),
            async handleCurrentChange(pageNo) {
                this.$store.commit('search/update', {
                    loading: true,
                })
                eventBus.searchResult = []
                let data = await this.$musicApi.searchSong(this.keywords, pageNo)
                if (data.status) {
                    eventBus.searchResult = data.data
                    this.$store.commit('search/update', {
                        loading: false
                    })
                } else {
                    console.warn(data)
                    this.$message.warning(data.msg)
                }
            }
        },
        beforeRouteEnter(to, from, next) {
            if (Vue.$store.state.search.keywords.length > 0) {
                next()
            } else {
                Vue.$router.push('/')
            }
        }
    }
</script>
<style lang="scss" module="s">
    .searchResult {
        .top {
            display: flex;
            justify-content: space-between;
            padding: 0 20px;
            margin: 24px 0;
            align-items: flex-end;
            .title {
                display: flex;
                width: 100%;
                font-size: 20px;
                color: #191919;
                align-items: center;
                line-height: 1;
                .keyword {
                    color: #FC581F;
                }
            }
            :global {
                .el-checkbox + .el-checkbox {
                    margin-left: 12px;
                }
            }
        }
    }
</style>