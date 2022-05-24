import { createStore } from 'vuex'

class Member {
  constructor(name, otherMembers) {
    this.name = name;
    this.co = null;
    this.deathReason = null;
    this.otherMembers = otherMembers; // Array<Member> ※自分を含む
  }
}

const _memberNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
let _members = [];
if (localStorage.getItem('members')) {
  _members = JSON.parse(localStorage.getItem('members'));
} else {
  _members = _memberNames.map(myName => {
    const otherMembers = _memberNames.map(otherMemberName => {
      const otherMember = new Member(otherMemberName, []);
      otherMember.isHangingOption = myName !== otherMemberName;
      otherMember.report = null;
      return otherMember;
    });
    return new Member(myName, otherMembers);
  });
}
console.log(_members);

export default createStore({
  state: {
    _memberNames,
    _members
  },
  getters: {
    members(state) {
      return state._members;
    }
  },
  mutations: {
    setNames(state, { memberIdx, newName }) {
      state._members[memberIdx].name = newName;
      for (const member of state._members) {
        member.otherMembers[memberIdx].name = newName;
      }
      localStorage.setItem('members', JSON.stringify(state._members));
    },
    setCo(state, { memberIdx }) {
      const options = [null, '占', '霊', '狩'];
      const currentValue = state._members[memberIdx].co;
      const currentValueIdx = options.indexOf(currentValue);
      const nextValue = options[currentValueIdx + 1] || options[0];

      state._members[memberIdx].co = nextValue;
      for (const member of state._members) {
        member.otherMembers[memberIdx].co = nextValue;
      }
      localStorage.setItem('members', JSON.stringify(state._members));
    },
    setDeathReason(state, { memberIdx }) {
      const options = [null, '吊', '襲'];
      const currentValue = state._members[memberIdx].deathReason;
      const currentValueIdx = options.indexOf(currentValue);
      const nextValue = options[currentValueIdx + 1] || options[0];

      state._members[memberIdx].deathReason = nextValue;
      for (const member of state._members) {
        member.otherMembers[memberIdx].deathReason = nextValue;
      }
      localStorage.setItem('members', JSON.stringify(state._members));
    },
    setReport(state, { memberIdx, otherMemberIdx }) {
      if (state._members[memberIdx].co !== '占' && state._members[memberIdx].co !== '霊') {
        return;
      }
      const options = [null, '白', '黒'];
      const currentValue = state._members[memberIdx].otherMembers[otherMemberIdx].report;
      const currentValueIdx = options.indexOf(currentValue);
      state._members[memberIdx].otherMembers[otherMemberIdx].report = options[currentValueIdx + 1] || options[0];
      localStorage.setItem('members', JSON.stringify(state._members));
    },
    setOtherMembers(state) {
      // ======================================
      // ■初期化
      // ・自分を除外する
      // ・死亡済を除外する
      // ======================================
      for (const [memberIdx, member] of state._members.entries()) {
        for (const [otherMemberIdx, otherMember] of member.otherMembers.entries()) {
          otherMember.isHangingOption = true;
          if (memberIdx === otherMemberIdx) {
            otherMember.isHangingOption = false;
          }
          if (otherMember.deathReason !== null) {
            otherMember.isHangingOption = false;
          }
        }
      }

      // ======================================
      // ■自分が占のとき白を出したメンバーを除外
      // ======================================
      for (const [memberIdx, member] of state._members.entries()) {
        if (member.co === '占') {
          for (const [otherMemberIdx, otherMember] of member.otherMembers.entries()) {
            if (otherMember.report === '白') {
              otherMember.isHangingOption = false;
            }
          }
        }
      }

      // ======================================
      // ■対抗なしの占を除外する
      // ======================================
      const numOfUranai = state._members.filter(m => m.co === '占').length;
      if (numOfUranai === 1) {
        const onlyOneUranaiIdx = state._members.findIndex(m => m.co === '占');
        for (const [memberIdx, member] of state._members.entries()) {
          member.otherMembers[onlyOneUranaiIdx].isHangingOption = false;
        }
      }

      // ======================================
      // ■対抗なしの霊を除外する
      // ======================================
      const numOfReino = state._members.filter(m => m.co === '霊').length;
      if (numOfReino === 1) {
        const onlyOneReinoIdx = state._members.findIndex(m => m.co === '霊');
        for (const [memberIdx, member] of state._members.entries()) {
          member.otherMembers[onlyOneReinoIdx].isHangingOption = false;
        }
      }

      // ======================================
      // ■5人以上がCOしたときのCOなしを除外する
      // ======================================
      const numOfCo = state._members.filter(m => m.co !== null).length;
      if (5 <= numOfCo) {
        for (const [memberIdx, member] of state._members.entries()) {
          for (const [otherMemberIdx, otherMember] of member.otherMembers.entries()) {
            if (otherMember.co === null) {
              otherMember.isHangingOption = false;
            }
          }
        }
      }

      localStorage.setItem('members', JSON.stringify(state._members));
    },
    removeOtherThanName(state) {
      for (const [memberIdx, member] of state._members.entries()) {
        member.co = null;
        member.deathReason = null;
        member.isHangingOption = true;

        for (const [otherMemberIdx, otherMember] of member.otherMembers.entries()) {
          otherMember.co = null;
          otherMember.deathReason = null;
          otherMember.isHangingOption = true;
          otherMember.report = null;
        }
      }
    },
  },
  actions: {
    setNames(context, { memberIdx, newName }) {
      context.commit('setNames', { memberIdx, newName });
    },
    setCo(context, { memberIdx }) {
      context.commit('setCo', { memberIdx });
      context.commit('setOtherMembers');
    },
    setDeathReason(context, { memberIdx }) {
      context.commit('setDeathReason', { memberIdx });
      context.commit('setOtherMembers');
    },
    setReport(context, { memberIdx, otherMemberIdx }) {
      context.commit('setReport', { memberIdx, otherMemberIdx });
      context.commit('setOtherMembers');
    },
    removeStoredMembers() {
      localStorage.removeItem('members');
    },
    removeOtherThanName(context) {
      context.commit('removeOtherThanName');
      context.commit('setOtherMembers');
    }
  },
  modules: {}
})
