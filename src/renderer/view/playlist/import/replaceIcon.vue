<template>
    <div>
        <el-popover ref="replace"
                    placement="top"
                    trigger="click"
                    @show="search"
        >
            <p :class="s.title">单击行将直接更换</p>
            <DataTable :data="result"
                       :total="total"
                       :pageSize="pageSize"
                       :loading="loading"
                       @change="search"
                       :showOperate="false"
                       :pagination="true"
                       @rowClick="rowClick"
                       element-loading-text="拼命加载中...搜索三个平台...还要花时间去重哦~"
                       style="max-height: 300px; overflow: auto; width: 600px; padding: 0"
            ></DataTable>
            <span slot="reference" :class="s.replace">换</span>
        </el-popover>
    </div>
</template>
<script>

    export default {
        props: {
            info: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        data() {
            return {
                result: [],
                loading: false,
                pageSize: 30,
                total: 0
            }
        },
        methods: {
            async search(pageNo = 0) {
                console.log('search')
                this.loading = true
                let data = await this.$musicApi.searchSong(this.info.name, pageNo)
                if (data.status) {
                    let result = []
                    let count = 0
                    let total = 0
                    let temp = data.data
                    Object.keys(temp).forEach(key => {
                        total += temp[key].total
                        count++
                        let cur = temp[key].songs
                        cur.forEach(item => {
                            result.push({
                                ...item,
                                songId: item.id,
                                vendor: key,
                            })
                        })
                    })
                    this.total = total
                    this.pageSize = 30 * count
                    this.result = result
                } else {
                    console.warn(data)
                    this.$message.warning(data.msg)
                }
                this.loading = false
            },
            rowClick(item) {
                this.$emit('replace', item)
            }
        }
    }
</script>
<style lang="scss" module="s">
    .replace {
        margin-right: -1px;
        line-height: 1;
        font-size: 13px;
        padding: 1px;
        cursor: pointer;
        position: relative;
        top: 1px;
    }

    .title {
        padding-left: 10px;
        margin: 0;
        color: #303133;
        &::before {
            content: '*';
            font-size: 20px;
            color: #F56C6C;
            position: relative;
            top: 5px;
            margin-right: 2px;
        }
    }
</style>