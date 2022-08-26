<!-- 单个图片上传 -->
<template>
	<div class="upload-container">
		<el-upload
			class="avatar-uploader"
			:class="disabled || !!value ? 'isActive' : ''"
			action
			:http-request="uploadImg"
			:show-file-list="false"
			:before-upload="handleBeforeupload"
			:disabled="!!value || disabled"
			accept="image/png,image/jpeg"
			v-loading="isLoading"
		>
			<img v-if="value" :src="value" class="avatar" :style="{ objectFit: objectFit }" />
			<i v-else class="el-icon-plus avatar-uploader-icon"></i>
		</el-upload>
		<i v-show="!disabled && value" class="el-icon-circle-close upload-close" @click="handleRemove"></i>
	</div>
</template>

<script>
import { uploadSingleFile, deleteFile } from '@/api/productionManagement/cus';
export default {
	props: {
		value: { default: '' }, // 必须要使用value
		disabled: { default: false },
		isDelete: { default: true }, // 是否需要真删除服务器图片 true 是 false 否
		objectFit: { default: 'cover' } // 是否需要真删除服务器图片 true 是 false 否
	},

	data() {
		return {
			uploadFileUrl: uploadSingleFile,
			imgUrl: '',
			disupAble: false,
			isLoading: false
		};
	},
	watch: {
		value: function(newVal, oldVal) {
		}
	},
	methods: {
		handleRemove() {
			if (this.isDelete) {
				this.$confirm('此操作将永久删除该文件,需重新上传，是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					showClose: false,
					center: true
				})
					.then(() => {
						// let fileUrl = [];
						// fileUrl.push(this.value);
						deleteFile(this.value).then(res => {
							if (res.code === 0) {
								this.$emit('input', '');
								this.disupAble = false;
							} else {
								// this.$message.error(res.message);
							}
						});
					})
					.catch(() => {});
			} else {
				this.$emit('input', '');
				this.disupAble = false;
			}
		},
		handleBeforeupload(file) {
			const list = ['image/jpeg', 'image/png'];
			const isJPG = list.some(item => {
				return item == file.type;
			});
			// const isLt1M = file.size / 1024 / 1024 < 2;
			if (!isJPG) {
				this.$alert('请上传png或jpeg格式的图片!', '提示', { confirmButtonText: '知道了', showClose: false });
			}
			// if (!isLt1M) {
			//   this.$alert('图片大小不能超过2M!', '提示', { confirmButtonText: '知道了',showClose:false });
			// }
			return isJPG;
			// return isJPG && isLt1M;
		},
		// // 上传图片
		uploadImg(fileObj) {
			this.isLoading = true;
			let formData = new FormData();
			formData.set('file', fileObj.file);
			uploadSingleFile(formData).then(res => {
				this.$emit('input', res.data);
				this.disupAble = true;
				this.isLoading = false;
			});
		}
	}
};
</script>

<style lang="scss" scoped>
/* 表单内单个图像上传 */
.upload-container {
	position: relative;
	.avatar-uploader {
		width: 100%;
		height: 100%;
		::v-deep .el-upload {
			width: 100%;
			height: 100%;
			border: 1px dashed #d9d9d9;
			position: relative;
			overflow: hidden;
			display: flex;
			justify-content: center;
			align-items: center;
			.avatar-uploader-icon {
				font-size: 28px;
				color: #8c939d;
			}
			.avatar {
				width: 100%;
				height: 100%;
				display: block;
			}
		}
	}
	.avatar-uploader.isActive {
		::v-deep .el-upload {
			cursor: default;
			border-color: #d9d9d9;
		}
	}
	.upload-close {
		position: absolute;
		font-size: 16px;
		top: -8px;
		right: -8px;
		cursor: pointer;
		// color: @color-warning;
	}
}
</style>
