
 <script setup name='MemberLayout'>
import AppMemberAside from "@/components/app-member-aside.vue";
</script>
 

 <template>
    <div class="container">
        <AppMemberAside></AppMemberAside>

        <!-- 三级路由出口 -->
        <article class="article">
            <RouterView />
        </article>
    </div>
</template>

<style lang='less' scoped>
.container {
    display: flex;
    padding-top: 20px;
    .article {
        width: 1000px;
    }
}

</style>