<template>
  <div id="web" class="web">
      <vHeader v-bind:dialogFormVisible = "dialogFormVisible" v-on:registerBoxStatus="showRegisterBox($event)"/>
      <vNavMenu/>
      <!--注册对话框-->
      <div>
          <el-dialog title="用户注册" :visible.sync="dialogFormVisible">
              <el-form :model="registerFormData" status-icon ref="registerForm" :rules="rules">
                  <el-form-item label="用户名" :label-width="formLabelWidth" prop="userName">
                      <el-input v-model="registerFormData.userName" autocomplete="off" placeholder="2-20位字符"></el-input>
                  </el-form-item>
                  <el-form-item label="性别" :label-width="formLabelWidth">
                      <el-radio-group v-model="registerFormData.gender" prop="gender">
                          <el-radio :label="0">女</el-radio>
                          <el-radio :label="1">男</el-radio>
                      </el-radio-group>
                  </el-form-item>
                  <el-form-item label="昵称" :label-width="formLabelWidth" prop="nickName">
                      <el-input v-model="registerFormData.nickName" autocomplete="off" placeholder="2-20位字符"></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱地址" :label-width="formLabelWidth"  prop="email">
                      <el-input v-model="registerFormData.email" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
                      <el-input v-model="registerFormData.phone" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="QQ" :label-width="formLabelWidth" prop="qq">
                      <el-input v-model="registerFormData.qq" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="微信号" :label-width="formLabelWidth" prop="weChat">
                      <el-input v-model="registerFormData.weChat" autocomplete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
                      <el-input show-password type="password" v-model="registerFormData.password" autocomplete="off" placeholder="6-20位字符在数字、小写、大写字母以及特殊字符中四选三"></el-input>
                      <el-progress :percentage="this.registerFormData.passwordPercent" :format="passwordPercentFormat"></el-progress>
                  </el-form-item>
                  <el-form-item label="再次输入密码" :label-width="formLabelWidth" prop="comfirmPassword">
                      <el-input show-password type="password" v-model="registerFormData.comfirmPassword" autocomplete="off"></el-input>
                  </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                  <el-button @click="resetForm('registerForm')">重置</el-button>
                  <el-button type="primary" @click="register('registerForm')">注 册</el-button>
              </div>
          </el-dialog>
      </div>
        <router-view v-if="isRouterAlive"></router-view>
      <vFooter/>
  </div>
</template>
<script>
    import vHeader from './views/Header.vue'
    import vNavMenu from './views/NavMenu.vue'
    import vFooter from './views/Footer.vue'
export default {
  name: 'web',
  provide(){
      return{
          reload:this.reload
      }
  },
  data(){
      const validateUserName = (rule, value, callback) => {
          if (value === '') {
              callback(new Error('请输入用户名'));
          }
          if (value.length<2 || value.length>20) {
              callback(new Error('请输入2-20位字符'));
          }
          this.$axios.get("http://127.0.0.1:8081/users/selectByName?userName="+ value).then((response)=>{
              this.userNameIsExist = response.data.info.isExist;
              if(this.userNameIsExist)
                  callback(new Error('用户名已存在'));
              callback();
          });
      };
      const validatePassword = (rule, value, callback) => {
          if (value === '') {
              callback(new Error('请输入密码'));
          } else {
              //6-20位包含字符、数字和特殊字符
              var ls = 0;
              if (this.registerFormData.password !== '') {
                  if(this.registerFormData.password.match(/([a-z])+/)){
                      ls++;
                  }
                  if(this.registerFormData.password.match(/([0-9])+/)){
                      ls++;
                  }
                  if(this.registerFormData.password.match(/([A-Z])+/)){
                      ls++;
                  }
                  if(this.registerFormData.password.match(/[~',.!@#$%^&*()-+_=:]+/)){
                      ls++;
                  }
                  if(this.registerFormData.password.length<6 || this.registerFormData.password.length>20 ){
                      callback(new Error('要求6-20位字符'));
                      ls=0;
                  }
                  if(this.registerFormData.password.match(/([\u4E00-\u9FA5])+/)){
                      callback(new Error('不能包含中文字符'));
                      ls=0;
                  }
                  switch (ls) {
                      case 0: this.registerFormData.passwordPercent = 0;callback(new Error('数字、小写字母、大写字母以及英文状态输入的特殊字符中四选三'));break;
                      case 1: this.registerFormData.passwordPercent = 33;callback(new Error('数字、小写字母、大写字母以及英文状态输入的特殊字符中四选三'));break;
                      case 2: this.registerFormData.passwordPercent = 66;callback(new Error('数字、小写字母、大写字母以及英文状态输入的特殊字符中四选三'));break;
                      case 3:
                      case 4: this.registerFormData.passwordPercent = 100;break;
                      default: this.registerFormData.passwordPercent = 0;break;
                  }
              }
              callback();
          }
      };
      const validateConfirmPassword = (rule, value, callback) => {
          if (value === '') {
              callback(new Error('请再次输入密码'));
          } else {
              if (this.registerFormData.comfirmPassword !== this.registerFormData.password) {
                  callback(new Error('两次输入的密码不一致'));
              }
              callback();
          }
      };
      const validatePhone = (rule, value, callback) => {
          if (value != '') {
              // callback(new Error('请输入手机号'));
              if (this.registerFormData.phone.match(/^1[34578]\d{9}$/) == null) {
                  callback(new Error('请输入合法手机号'));
              }
          }
          callback();
      };
      return{
          //表单变量
          userNameIsExist:false,
          dialogFormVisible: false,
          registerFormData: {
              userName: '',
              gender: 0,
              email: '',
              nickName: '',
              phone: '',
              qq:'',
              weChat:'',
              password:'',
              comfirmPassword: '',
              passwordPercent:0,
          },
          rules: {
              userName: [
                  {required: true,validator: validateUserName, trigger: ['blur', 'change']}
              ],
              nickName: [
                  {required: true, message: '请输入昵称', trigger: 'blur'},
                  {min: 2, max: 20, message: '长度在 2 到 20 个字符之间', trigger: ['blur', 'change']}
              ],
              email:[
                  { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
              ],
              phone: [
                  {validator: validatePhone, trigger: ['blur', 'change']}
              ],
              qq:'',
              weChat:'',
              password:[
                  { required: true,  validator: validatePassword, trigger: ['blur', 'change'] },
              ],
              comfirmPassword:[
                  { required: true, validator: validateConfirmPassword, trigger: ['blur', 'change'] }
              ],
          },
          formLabelWidth: '120px',
          isRouterAlive:true
      }
  },
    components:{
        vHeader,
        vFooter,
        vNavMenu
    },
  methods:{
      reload(){
      this.isRouterAlive = false;
      this.$nextTick(function(){
        this.isRouterAlive = true;
      })
    },
      passwordPercentFormat(percentage){
          return percentage === 100 ? '符合' : `不符`;
      },
      resetForm(formName) {
          this.$refs[formName].resetFields();
          this.registerFormData.passwordPercent = 0;
      },
      register(formName){
          this.$refs[formName].validate((valid) => {
              if (valid) {
                  this.dialogFormVisible = false;
                  let formData = new FormData();//创建formData对象
                  for(let key in this.registerFormData){
                      formData.append(key,this.registerFormData[key]);
                      // console.log(formData.get(key));
                  }
                  this.$axios({
                      method:"post",
                      url:"http://127.0.0.1:8081/users/register",
                      headers: {
                          "Content-Type": "multipart/form-data"
                      },
                      withCredentials:true,
                      data:formData
                  }).then((response)=>{
                      this.$message({
                          message: response.data.msg,
                          type: 'success'
                      });
                  });
                  this.resetForm(formName);
                  // history.go(0);
              } else {
                  console.log('error submit!!');
                  return false;
              }
          });
      },
      showRegisterBox(msg){
          this.dialogFormVisible = msg;
      },
  }
}
</script>

<style>
    *{
        margin: 0;
        padding: 0;
    }
    body{
        background-color: #E9FAFF;
    }
</style>

