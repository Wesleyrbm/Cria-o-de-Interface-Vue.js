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
        status: "Disponível",
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
      return this.equipamentos.filter(e => e.status === "Disponível").length;
    },
    totalEmprestados() {
      return this.equipamentos.filter(e => e.status === "Emprestado").length;
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

      // 🔎 Validação de duplicidade (mesmo patrimônio na mesma categoria)
      const existe = this.equipamentos.some(e =>
        e.patrimonio.toLowerCase() === this.form.patrimonio.toLowerCase() &&
        e.categoria.toLowerCase() === this.form.categoria.toLowerCase() &&
        e.id !== this.form.id // evita bloquear edição do mesmo item
      );

      if (existe) {
        alert("Já existe um equipamento com esse patrimônio na mesma categoria!");
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
      this.form = { id: null, nome: "", categoria: "", patrimonio: "", status: "Disponível" };
    },
    salvarLocalStorage() {
      localStorage.setItem("equipamentos", JSON.stringify(this.equipamentos));
    },
  },
}).mount("#app");
