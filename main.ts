class Student {
    private static _count = 0;

    public readonly id: number;
    public readonly firstName: string;
    public readonly lastName: string;
    public readonly createdAt: number;

    constructor(firstName: string, lastName: string) {
        Student._count++
        this.id = Student._count;
        this.firstName = firstName
        this.lastName = lastName
        this.createdAt = Date.now()
    }

    static get count(): number {
        return Student._count
    }
    public fullName(): string {
        return `${this.firstName} ${this.lastName}`
    }
}

class StudentStore {
    private students: Student[] = []

    public add(student: Student): void{
        this.students.push(student)
    }
    public list(): readonly Student[]{
        return this.students
    }
    public size(): number {
        return this.students.length
    }
}


class StudentApp {
  private firstNameEl: HTMLInputElement;
  private lastNameEl: HTMLInputElement;
  private addBtnEl: HTMLButtonElement;
  private counterEl: HTMLSpanElement;
  private cardsEl: HTMLDivElement;
  private errorEl: HTMLDivElement;

  constructor(private store: StudentStore) {
    this.firstNameEl = this.must<HTMLInputElement>("#firstName");
    this.lastNameEl = this.must<HTMLInputElement>("#lastName");
    this.addBtnEl = this.must<HTMLButtonElement>("#addBtn");
    this.counterEl = this.must<HTMLSpanElement>("#counter");
    this.cardsEl = this.must<HTMLDivElement>("#cards");
    this.errorEl = this.must<HTMLDivElement>("#error");

    this.addBtnEl.addEventListener("click", () => this.onAdd());
    this.lastNameEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.onAdd();
    });

    this.render();
  }

  private must<T extends Element>(selector: string): T {
    const el = document.querySelector(selector);
    if (!el) throw new Error(`Не найден элемент: ${selector}`);
    return el as T;
  }

  private normalize(s: string): string {
    return s.trim().replace(/\s+/g, " ");
  }

  private setError(msg: string): void {
    this.errorEl.textContent = msg;
  }

  private onAdd(): void {
    const first = this.normalize(this.firstNameEl.value);
    const last = this.normalize(this.lastNameEl.value);

    if (!first || !last) {
      this.setError("Заполни и имя, и фамилию.");
      return;
    }

    this.setError("");

    const student = new Student(first, last);
    this.store.add(student);

    this.firstNameEl.value = "";
    this.lastNameEl.value = "";
    this.firstNameEl.focus();

    this.render();
  }

  private render(): void {
    // каунтер на статике (сколько создано Student)
    this.counterEl.textContent = String(Student.count);

    this.cardsEl.innerHTML = "";
    for (const st of this.store.list()) {
      const card = document.createElement("div");
      card.className = "card";

      const name = document.createElement("div");
      name.className = "name";
      name.textContent = st.fullName();

      const hint = document.createElement("div");
      hint.className = "hint";
      hint.textContent = `ID: ${st.id}`;

      card.append(name, hint);
      this.cardsEl.append(card);
    }
  }
}

// запуск
new StudentApp(new StudentStore());
