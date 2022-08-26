<template>
    <div>
        
        <!-- <keep-alive>
            <router-view v-if="$route.meta.keepAlive" :key="$route.fullPath"/>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" :key="$route.fullPath"/> -->
        <router-view></router-view>
    </div>
</template>

<script>
export default {
}
</script>

<style>
</style>
