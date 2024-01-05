<template>
  <el-button color="#626aef" @click="dialogVisible = true">设置代理</el-button>
  <el-button color="#626aef" @click="previewProxy">查看代理</el-button>
  <el-dialog v-model="dialogVisible" title="设置代理" width="50%">
    <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" class="demo-ruleForm">
      <el-form-item label="代理地址" prop="host">
        <el-input v-model="ruleForm.host" type="text" placeholder="格式：http://127.0.0.1:7890" />
      </el-form-item>
    </el-form>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">Submit</el-button>
      <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
    </el-form-item>
  </el-dialog>
</template>

<script setup>
const { ipcRenderer } = require("electron");
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";

const dialogVisible = ref(false);

const ruleFormRef = ref();
const ruleForm = reactive({
  host: "", // http://127.0.0.1:7890
});

const validatePass2 = (rule, value, callback) => {
  callback();
};

const rules = reactive({
  host: [{ validator: validatePass2, trigger: "blur" }],
});

const submitForm = (formEl) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {

      if (!ruleForm.host) {
        ruleForm.host = "";
        dialogVisible.value = false;
        ipcRenderer.send("set-proxy-agent", ruleForm.host);
        return
      }

      let isHost = validateProtocolIPPort(ruleForm.host);
      if (!isHost) {
        ElMessage.error("格式错误！");
        ruleForm.host = "";
      }
      ipcRenderer.send("set-proxy-agent", ruleForm.host);
      dialogVisible.value = false;
    } else {
      console.log("error submit!");
      return false;
    }
  });
};

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};

const previewProxy = () => {
  ipcRenderer.send("check-proxy-Agent");
};

// 验证ip是否正确
function validateProtocolIPPort(input) {
  // 验证协议（http:// 或 https://）
  const protocolRegex = /^(http:\/\/|https:\/\/)/;
  if (!protocolRegex.test(input)) {
    return false;
  }

  // 验证 IP 地址
  const ipRegex =
    /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/;
  if (!ipRegex.test(input)) {
    return false;
  }

  // 验证端口号（1-65535）
  const portRegex = /:[0-9]{1,5}/;
  if (!portRegex.test(input)) {
    return false;
  }

  return true;
}
</script>