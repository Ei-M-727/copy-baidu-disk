<template>
  <div class="login-body">
    <div class="bg"></div>
    <div class="login-panel">
      <!--   rules属性传入验证规则
               prop属性设置需要校验的字段名
               model属性是用来指定表单使用的数据
        -->
      <el-from
        class="login-register"
        :model="formData"
        :rules="rules"
        ref="formDataRef"
      >
        <div class="login-title">Nebula云盘</div>
        <!-- 用户名/邮箱 -->
        <el-form-item prop="email">
          <el-input
            size="large"
            clearable
            placeholder="请输入邮箱"
            v-model.trim="formData.email"
            maxlength="150"
          >
            <template #prefix>
              <span class="iconfont icon-account"></span>
            </template>
          </el-input>
        </el-form-item>
        <!-- 登录密码 -->
        <el-form-item prop="password" v-if="opType == 1">
          <el-input
            size="large"
            clearable
            placeholder="请输入密码"
            v-model.trim="formData.password"
            show-password
          >
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
          </el-input>
        </el-form-item>
        <!-- 注册 -->
        <div v-if="opType == 0 || opType == 2">
          <el-form-item prop="emailCode">
            <div class="send-email-panel">
              <el-input
                size="large"
                placeholder="请输入邮箱验证码"
                v-model.trim="formData.emailCode"
              >
                <template #prefix>
                  <span class="iconfont icon-checkcode"></span>
                </template>
              </el-input>

              <el-button
                class="send-email-btn"
                type="primary"
                size="large"
                @click="getEmailCode"
                >获取验证码</el-button
              >
            </div>
            <el-popover placement="left" :width="500" trigger="click">
              <div>
                <p>1、在垃圾箱中查找邮箱验证码</p>
                <p>2、在邮箱中头像-设置-反垃圾-白名单-设置邮箱地址白名单</p>
                <p>3、将邮箱【mz_03027@163.com】添加到白名单不知道怎么设置</p>
              </div>
              <template #reference>
                <span class="a-link" :style="{ 'font-size': '14px' }"
                  >未收到邮箱验证码？</span
                >
              </template>
            </el-popover>
          </el-form-item>
          <!-- 昵称 -->
          <el-form-item prop="nickName" v-if="opType == 0">
            <el-input
              size="large"
              placeholder="请输入昵称"
              v-model="formData.nickName"
              maxlength="20"
            >
              <template #prefix>
                <span class="iconfont icon-account"></span>
              </template>
            </el-input>
          </el-form-item>
          <!-- 注册密码、找回密码 -->
          <el-form-item prop="registerPassword">
            <el-input
              type="password"
              size="large"
              placeholder="请输入密码"
              v-model="formData.registerPassword"
            >
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
            </el-input>
          </el-form-item>
          <!-- 重复密码 -->
          <el-form-item prop="reRegisterPassword">
            <el-input
              type="password"
              size="large"
              placeholder="请再次输入密码"
              v-model="formData.reRegisterPassword"
            >
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
            </el-input>
          </el-form-item>
        </div>

        <!-- 验证码 -->
        <el-form-item prop="checkCode">
          <div class="check-code-panel">
            <el-input
              size="large"
              placeholder="请输入验证码"
              v-model.trim="formData.checkCode"
              show-password
            >
              <template #prefix>
                <span class="iconfont icon-checkcode"></span>
              </template>
            </el-input>
            <img
              :src="checkCodeUrl"
              alt=""
              class="check-code"
              @click="changeCheckCode(0)"
            />
          </div>
        </el-form-item>
        <!-- 记住我 -->
        <el-form-item v-if="opType == 1">
          <div class="rememberme-panel">
            <el-checkbox v-model="formData.rememberMe">记住我</el-checkbox>
          </div>
          <div class="no-account">
            <a href="javascript:void(0)" class="a-link" @click="showPanel(2)"
              >忘记密码？</a
            >
            <a href="javascript:void(0)" class="a-link" @click="showPanel(0)"
              >没有帐号?</a
            >
          </div>
        </el-form-item>
        <!-- 去登录 -->
        <el-form-item v-if="opType == 2">
          <a href="javascript:void(0)" class="a-link" @click="showPanel(1)"
            >去登录？</a
          >
        </el-form-item>
        <!-- 已有帐号-->
        <el-form-item v-if="opType == 0">
          <a href="javascript:void(0)" class="a-link" @click="showPanel(1)"
            >已有帐号？</a
          >
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            class="op-btn"
            size="large"
            @click="doSubmit"
          >
            <span v-if="opType == 0">注册</span>
            <span v-if="opType == 1">登录</span>
            <span v-if="opType == 2">重置密码</span>
          </el-button>
        </el-form-item>
      </el-from>
    </div>
    <Dialog
      :show="dialogConfig4SendMailCode.show"
      :title="dialogConfig4SendMailCode.title"
      :buttons="dialogConfig4SendMailCode.buttons"
      width="500px"
      :showCancel="false"
      @close="dialogConfig4SendMailCode.show = false"
    >
      <el-form
        :model="formData4SendMailCode"
        :rules="rules"
        ref="formData4SendMailCodeRef"
        label-width="80px"
        @submit.prevent
      >
        <!-- 输入 -->
        <el-form-item label="邮箱">
          {{ formData.email }}
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
// nextTick指定的回调在DOM更新之后再执行
// ref 应用在html标签上获取真实的DOM元素。  应用在组件标签上获取组件实例对象
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance(); //getCurrentInstance：可以获取挂载在全局的属性和获取上下文
const api = {
  checkCode: "/api/checkCode",
};

//操作类型 0:注册 1:登录 2:重置密码
const opType = ref(1);
const showPanel = (type) => {
  opType.value = type;
};

const checkRePassword = (rule, value, callback) => {
  if (value !== formData.value.reRegisterPassword) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};

const formData = ref({});
const formDataRef = ref();
const rules = {
  email: [
    { required: true, message: "请输入邮箱" },
    { validator: proxy.Verify.email, message: "请输入正确的邮箱" },
  ],
  password: [{ required: true, message: "请输入密码" }],
  emailCode: [{ required: true, message: "请输入邮箱验证码" }],
  nickName: [{ required: true, message: "请输入昵称" }],
  registerPassword: [
    { required: true, message: "请输入密码" },
    {
      validator: proxy.Verify.password,
      message: "密码只能是数字，字母，特殊字符 8-18位",
    },
  ],
  reRegisterPassword: [
    { required: true, message: "请再次输入密码" },
    {
      validator: checkRePassword,
      message: "两次输入的密码不一致",
    },
  ],
  checkCode: [{ required: true, message: "请输入图片验证码" }],
};

const checkCodeUrl = ref(api.checkCode);
const changeCheckCode = (type) => {
  checkCodeUrl.value =
    api.checkCode + "?type=" + type + "&time=" + new Date().getTime(); //验证码的刷新就是靠这个时间戳
};

//发送邮箱验证码
const formData4SendMailCode = ref({});
const formData4SendMailCodeRef = ref();

const dialogConfig4SendMailCode = reactive({
  show: false,
  title: "发送邮箱验证码",
  buttons: [
    {
      type: "primary",
      text: "发送验证码",
      click: (e) => {
        submitForm();
      },
    },
  ],
});

const getEmailCode = () => {
  // formDataRef.value.validateField("email", (valid) => {
  //   if (!valid) {
  //     return;
  //   }
  //   dialogConfig4SendMailCode.show = true;
  // });
  console.log(formDataRef);
};
</script>



<style lang="scss" scoped>
.login-body {
  height: calc(100vh);
  // 把背景图像扩展至足够大，以使背景图像完全覆盖背景区域。
  background: url("@/assets/infinity-4980496.jpg") no-repeat;
  display: flex;

  background-size: 100% 100%;
  background-attachment: fixed;
  .bg {
    flex: 1;
    // background-size: cover;
    // background-position: center;
    // background-size: 800px;
    // background-repeat: no-repeat;
    // background-image: url("../assets/login_img.png");
  }
  .login-panel {
    width: 430px;
    margin-right: 15%;
    margin-top: calc((100vh - 500px) / 2);
    // height: 400px;

    .login-register {
      padding: 25px;
      background: #fff;
      border-radius: 5px;
      .login-title {
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 20px;
        // background-color: #fff;
      }
      .send-email-panel {
        display: flex;
        width: 100%;
        justify-content: space-between;
        .send-mail-btn {
          margin-left: 5px;
        }
      }
      .rememberme-panel {
        width: 100%;
      }
      .no-account {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
      .op-btn {
        width: 100%;
      }
    }
  }

  .check-code-panel {
    width: 100%;
    display: flex;
    .check-code {
      margin-left: 5px;
      cursor: pointer;
    }
  }
  .login-btn-qq {
    margin-top: 20px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      cursor: pointer;
      margin-left: 10px;
      width: 20px;
    }
  }
}
</style>
