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
          <el-menu class="el-menu-vertical-demo" router >
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

            <el-menu-item index="message">
              <i class="el-icon-bell"></i>
              <span slot="title">我的消息</span>
            </el-menu-item>
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
    }
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
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
          const { data: res } = await this.$http.get(`http://182.92.185.137:8082/api/user/logout`)
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
    // 获取activeName
  },
}
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
  }
}
.el-main {
  background: #eaedf1;
}
</style>