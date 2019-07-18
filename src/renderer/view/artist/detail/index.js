import {mapActions} from 'vuex'

export default {
    data() {
        return {
            detail: {},
            songs: [],
            loading: false,
            total: 0,
            pageSize: 30
        }
    },
    computed: {
        id() {
            return this.$route.params.id
        },
        vendor() {
            return this.$route.query.vendor
        }
    },
    methods: {
        ...mapActions('play', ['play']),
        async getSongs(pageNo = 0) {
            this.loading = true
            try {
                let data = await Vue.$musicApi.getArtistSongs(this.vendor, this.id, pageNo, this.pageSize)
                if (data.status) {
                    this.detail = data.data.detail
                    this.songs = data.data.songs.map(item => {
                        return {
                            ...item,
                            songId: item.id,
                            vendor: this.vendor
                        }
                    }),
                    this.total = data.data.total
                }
            } catch (e) {
                console.warn(e)
                e.msg && this.$message.warning(e.msg)
            }
            this.loading = false
        },
        handleCurrentChange (pageNo) {

        }
    },
    created() {
        this.getSongs()
    },
    beforeRouteUpdate(to, form, next) {
        next()
        this.getSongs()
    },
    beforeRouteEnter(to, from, next) {
        if (!to.query.vendor) {
            return Vue.$router.push('/')
        }
        next()
    }
}