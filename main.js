const { createApp } = Vue;

createApp({
  data() {
    return {
      equipamentos: JSON.parse(localStorage.getItem("equipamentos")) || [],
      form: {
        id: null,
        nome: "",
        categoria: "",
        patrimonio: "",
        status: "disponível",
      },
      editando: false,
      filtroCategoria: "",
    };
  },
  computed: {
    totalEquipamentos() {
      return this.equipamentos.length;
    },
    totalDisponiveis() {
      return this.equipamentos.filter(e => e.status === "disponível").length;
    },
    totalEmprestados() {
      return this.equipamentos.filter(e => e.status === "emprestado").length;
    },
    equipamentosFiltrados() {
      if (!this.filtroCategoria) return this.equipamentos;
      return this.equipamentos.filter(e =>
        e.categoria.toLowerCase().includes(this.filtroCategoria.toLowerCase())
      );
    },
  },
  methods: {
    salvarEquipamento() {
      if (!this.form.nome || !this.form.categoria || !this.form.patrimonio) {
        alert("Preencha todos os campos!");
        return;
      }

      if (this.editando) {
        const index = this.equipamentos.findIndex(e => e.id === this.form.id);
        this.equipamentos[index] = { ...this.form };
        this.editando = false;
      } else {
        this.form.id = Date.now();
        this.equipamentos.push({ ...this.form });
      }

      this.salvarLocalStorage();
      this.resetarForm();
    },
    editarEquipamento(item) {
      this.form = { ...item };
      this.editando = true;
    },
    removerEquipamento(id) {
      if (confirm("Deseja remover este equipamento?")) {
        this.equipamentos = this.equipamentos.filter(e => e.id !== id);
        this.salvarLocalStorage();
      }
    },
    resetarForm() {
      this.form = { id: null, nome: "", categoria: "", patrimonio: "", status: "disponível" };
    },
    salvarLocalStorage() {
      localStorage.setItem("equipamentos", JSON.stringify(this.equipamentos));
    },
  },
}).mount("#app");
