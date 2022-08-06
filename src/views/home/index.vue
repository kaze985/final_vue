<template>
  <div class="home">
    <el-container>
      <!-- 头部 -->
      <el-header>
        <div class="left">
          <h2>物品交易系统</h2>
        </div>

        <div class="right">
          <span>欢迎您：{{ userInfo.userName }}</span>
          <el-button type="danger" size="mini" @click="logout">退出</el-button>
        </div>
      </el-header>

      <el-container>
        <!-- 侧边栏 -->
        <el-aside>
          <el-menu class="el-menu-vertical-demo" router :default-active="this.$route.path.replace('/', '')">
            <el-menu-item index="item">
              <i class="el-icon-menu"></i>
              <span slot="title">物品列表</span>
            </el-menu-item>

            <el-menu-item index="my">
              <i class="el-icon-s-custom"></i>
              <span slot="title">我的物品</span>
            </el-menu-item>

            <el-menu-item index="upload">
              <i class="el-icon-upload"></i>
              <span slot="title">上传物品</span>
            </el-menu-item>

            <el-badge :value="unReadMessage.length" class="item" type="primary" :hidden="unReadMessage.length == 0">
              <el-menu-item index="message">
                <i class="el-icon-bell"></i>
                <span slot="title">我的消息</span>
              </el-menu-item>
            </el-badge>
          </el-menu>
        </el-aside>

        <!-- 主体内容 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: null,
      menuList: [],
      isCollapse: false,
      wsUrl: 'ws://https://user-2010755-1309556468.ap-shanghai.run.tcloudbase.com/websocket/', // ws地址
      websock: null, // ws实例
      unReadMessage: unReadMessage,
    }
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    this.initWebSocket()
  },
  destroyed() {
    // 离开路由之后断开websocket连接
    this.websock.close()
  },
  provide() {
    return {
      websocketsend: this.websocketsend,
    }
  },
  methods: {
    // 退出登录
    logout() {
      this.$confirm('是否退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.get(`/api/user/logout`)
          if (res.isSuccess !== true) {
            return this.$message.error('退出失败')
          }
          this.$message({
            type: 'success',
            message: '退出成功!',
          })
          sessionStorage.clear()
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出',
          })
        })
    },
    initWebSocket() {
      this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      let socketUrl = this.wsUrl + this.userInfo.id
      if (typeof WebSocket === 'undefined') return console.log('您的浏览器不支持websocket')
      this.websock = new WebSocket(socketUrl)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    websocketonopen() {
      console.log('建立连接成功')
    },
    websocketonerror(e) {
      // 连接建立失败重连
      console.log('出现错误')
      console.log(e)
      // this.initWebSocket()
    },
    websocketonmessage(res) {
      // 数据接收
      const redata = JSON.parse(res.data)
      if (redata.type == 'notice' && redata.content.status == 'EXCHANGING') {
        unReadMessage.push(redata)
      } else {
        returnMessage = redata
      }
    },
    websocketsend(Data) {
      console.log('调用发送数据')
      // 数据发送
      this.websock.send(Data)
    },
    websocketclose(e) {
      // 关闭
      console.log('断开连接', e)
    },
  },
}
export let unReadMessage = []
export let returnMessage = {}
</script>

<style lang="scss">
.home {
  height: 100%;
}

.el-container {
  height: 100%;
}

.el-main {
  height: 100%;
  background: #eaedf1;
}

.el-header {
  background: #93defd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;

  .left {
    display: flex;
    align-items: center;
    img {
      width: 40px;
      margin-right: 20px;
    }
    span {
      font-size: 20px;
    }
  }

  .right {
    span {
      margin-right: 10px;
    }
  }
}

.el-aside {
  height: 100%;

  .toggle-button {
    background: #60779d;
    line-height: 24px;
    font-size: 16px;
    color: #fff;
    letter-spacing: 0.2rem;
    cursor: pointer;
  }

  .el-menu {
    text-align: left;
    height: auto;
    border-right: 0;
    width: 280px;
  }
}
.el-badge {
  width: 100%;
}
</style>