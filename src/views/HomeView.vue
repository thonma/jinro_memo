<template>
  <div class="main">
    <table>
      <tr>
        <th colspan="3"></th>
        <th
          v-for="member in members"
          v-bind:key="member.name"
          class="bg-primary p-1 fit-content-width"
          :class="{ 'bg-secondary text-gray': member.deathReason !== null }"
        >
          {{ member.name }}
        </th>
      </tr>
      <tr>
        <th colspan="3"></th>
        <th
          v-for="(member, memberIdx) in members"
          v-bind:key="member.name"
          class="bg-primary p-2 c-hand"
          :class="{ 'bg-secondary text-gray': member.deathReason !== null }"
          @click="setCo(memberIdx)"
        >
          {{ member.co || "&emsp;" }}
        </th>
      </tr>
      <tr>
        <th colspan="3"></th>
        <th
          v-for="(member, memberIdx) in members"
          v-bind:key="member.name"
          class="bg-primary p-1 c-hand"
          :class="{ 'bg-secondary text-gray': member.deathReason !== null }"
          @click="setDeathReason(memberIdx)"
        >
          {{ member.deathReason || "&emsp;" }}
        </th>
        <td class="px-2">
          <div class="form-group text-tiny">
            <label class="form-switch" for="checkbox">
              <input type="checkbox" id="checkbox" v-model="checked" />
              <i class="form-icon"></i>吊り候補を表示する
            </label>
          </div>
        </td>
      </tr>
      <tr v-for="(rowMember, memberIdx) in members" v-bind:key="memberIdx">
        <th
          class="fit-content-width bg-primary p-1"
          :class="{ 'bg-secondary text-gray': rowMember.deathReason !== null }"
        >
          <input
            type="text"
            name="rowMemberName"
            v-model="rowMember.name"
            class="text-center form-input"
            @keyup="setNames(memberIdx, rowMember.name)"
          />
        </th>
        <th
          class="bg-primary p-1 c-hand fit-content-width"
          :class="{ 'bg-secondary text-gray': rowMember.deathReason !== null }"
          @click="setCo(memberIdx)"
        >
          {{ rowMember.co || "&emsp;" }}
        </th>
        <th
          class="bg-primary p-1 c-hand fit-content-width"
          :class="{ 'bg-secondary text-gray': rowMember.deathReason !== null }"
          @click="setDeathReason(memberIdx)"
        >
          {{ rowMember.deathReason || "&emsp;" }}
        </th>
        <td
          v-for="(otherMember, otherMemberIdx) in rowMember.otherMembers"
          v-bind:key="otherMemberIdx"
          :class="{
            'bg-secondary': memberIdx !== otherMemberIdx,
            'bg-white': otherMember.report === '白',
            'bg-dark': otherMember.report === '黒',
          }"
          class="text-center c-hand"
          @click="setReport(memberIdx, otherMemberIdx)"
        >
          {{ otherMember.report || "&emsp;" }}
        </td>
        <td v-if="checked">
          <small>吊り候補:&nbsp;</small>
          <span
            v-for="(otherMember, otherMemberIdx) in rowMember.otherMembers"
            v-bind:key="otherMemberIdx"
          >
            <span
              class="d-inline-block px-2"
              :class="{
                'text-cancel text-secondary':
                  otherMember.isHangingOption === false,
              }"
              ><small>{{ otherMember.name }}</small></span
            >
          </span>
        </td>
      </tr>
    </table>

    <button class="btn btn-error btn-sm mr-1" @click="initAll()">
      すべて初期化
    </button>
    <button class="btn btn-error btn-sm" @click="initOtherThanName()">
      名前以外を初期化
    </button>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "HomeView",
  components: {},
  props: {
    checked: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const membersJson = sessionStorage.getItem("members");
    const members = computed(() => store.getters.members);

    const store = useStore();
    return {
      members,
      setNames(memberIdx, newName) {
        store.dispatch("setNames", { memberIdx, newName });
        console.log(this.members);
      },
      setCo(memberIdx) {
        store.dispatch("setCo", { memberIdx });
        console.log(this.members);
      },
      setDeathReason(memberIdx) {
        store.dispatch("setDeathReason", { memberIdx });
        console.log(this.members);
      },
      setReport(memberIdx, otherMemberIdx) {
        if (memberIdx === otherMemberIdx) {
          return;
        }
        store.dispatch("setReport", { memberIdx, otherMemberIdx });
        console.log(this.members);
      },
      initAll() {
        store.dispatch("removeStoredMembers");
        if (window.confirm("すべての記録を初期化してもよろしいですか?")) {
          window.onbeforeunload = null;
          location.reload();
        }
      },
      initOtherThanName() {
        if (window.confirm("名前以外を初期化してもよろしいですか?")) {
          store.dispatch("removeOtherThanName");
        }
      },
    };
  },
  created() {
    window.onbeforeunload = function (event) {
      event = event || window.event;
      event.returnValue = "";
    };
  },
};
</script>

<style lang="scss" scoped>
.main {
  padding: 1rem 2rem;
}
table {
  width: 100%;
  font-size: 1.2rem;
}

tr:nth-child(n + 3) th,
tr:nth-child(n + 3) td {
  border-bottom: 16px solid #fff;
}

input {
  font-size: 0.8rem;
  width: 3rem;
}
</style>
