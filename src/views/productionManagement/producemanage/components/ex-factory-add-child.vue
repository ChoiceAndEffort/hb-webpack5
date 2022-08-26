<template>
  <div>
    
  </div>
</template>

<script>
export default {
  props: {
    formData: {
      type: Object,
      default: "form",
    },
  },
  methods: {
      handleSave(row) {
          this.$emit('handleSave', row)
      },
      handleDelConfirm(data) {
          this.$$emit('handleDelConfirm', data)
      },
      handleCancel(row) {
          this.$emit('handleCancel', row)
      },
      handleEdit(row) {
          this.$emit("handleEdit", row)
      },
      handleAddData() {
          this.$emit('handleAddData')
      }
  }
};
</script>

<style>
</style>