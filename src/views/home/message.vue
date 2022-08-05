<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>我的消息</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <h2 v-if="unReadMsg.length == 0" style="color: #99a9bf">暂无交换请求</h2>
      <el-card class="request" v-for="msg in unReadMsg" :key="msg.content.id" :v-if="msg.content.status == 'EXCHANGING'">
        <div class="title">
          <b>{{ msg.content.activePartyItem.ownerName }}</b> 请求交换
        </div>
        <el-row>
          <el-col :span="10" class="item-box">
            <el-row>
              <el-col class="img" :span="12">
                <img :src="JSON.parse(msg.content.activePartyItem.imgs)[0]" alt="" class="cover" />
              </el-col>
              <el-col class="info" :span="12">
                <div class="name">物品名称：{{ msg.content.activePartyItem.name }}</div>
                <div class="owner">拥有者：{{ msg.content.activePartyItem.ownerName }}</div>
                <div class="value">
                  价格：<b>{{ msg.content.activePartyItem.value }}</b> 元
                </div>
              </el-col>
            </el-row>
          </el-col>

          <el-col :span="4" class="operate">
            <el-button type="primary" @click="confirm(msg)">确认交换</el-button>
            <img src="../../assets/imgs/exchange.png" alt="" />
            <el-button type="danger" @click="reject(msg)">拒绝交换</el-button>
          </el-col>

          <el-col :span="10" class="item-box">
            <el-row>
              <el-col class="img" :span="12">
                <img :src="JSON.parse(msg.content.passivePartyItem.imgs)[0]" alt="" class="cover" />
              </el-col>
              <el-col class="info" :span="12">
                <div class="name">物品名称：{{ msg.content.passivePartyItem.name }}</div>
                <div class="owner">拥有者：{{ msg.content.passivePartyItem.ownerName }}</div>
                <div class="value">
                  价格：<b>{{ msg.content.passivePartyItem.value }}</b> 元
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-card>
    </el-card>
  </div>
</template>

<script>
import { unReadMessage } from './index.vue'
import _ from 'lodash'

export default {
  inject: ['websocketsend'],
  data() {
    return {
      unReadMsg: unReadMessage,
    }
  },
  mounted() {
    console.log(this.unReadMsg)
  },
  methods: {
    confirm(msg) {
      this.$confirm('请确认是否与其进行交换', '提示', {
        confirmButtonText: '确定交换',
        cancelButtonText: '再考虑考虑',
        type: 'warning',
      }).then(() => {
        let actions = _.cloneDeep(msg)
        actions.type = 'agree'
        console.log(actions)
        this.sendMessage(JSON.stringify(actions))
        const index = this.unReadMsg.indexOf(msg)
        this.unReadMsg.splice(index, 1)
        this.$message({
          type: 'success',
          message: '已成功交换!',
        })
      }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消该操作'
          });          
        });
    },
    reject(msg) {
      this.$confirm('请确认是否拒绝与其进行交换', '提示', {
        confirmButtonText: '拒绝交换',
        cancelButtonText: '再考虑考虑',
        type: 'warning',
      }).then(() => {
        let actions = _.cloneDeep(msg)
        actions.type = 'agrrejectee'
        console.log(actions)
        this.sendMessage(JSON.stringify(actions))
        const index = this.unReadMsg.indexOf(msg)
        this.unReadMsg.splice(index, 1)
        this.$message({
          type: 'success',
          message: '已拒绝交换!',
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消该操作'
          });          
        });
      })
    },
    sendMessage(Data) {
      this.websocketsend(Data)
    },
  },
}
</script>

<style lang="scss">
.cover {
  height: 100px;
}
.info {
  height: 104px;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.el-row {
  display: flex;
  align-items: center;
  justify-content: center;
}
.item-box {
  padding: 10px;
}
.operate {
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 50px;
  }
}
.title {
  margin-bottom: 10px;
}
</style>