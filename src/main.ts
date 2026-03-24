
class Student {
    static _count = 0

    public readonly id: number
    public readonly firstName: string
    public readonly lastName: string
    public readonly createdAt: number

    constructor(firstName: string, lastName: string) {
        Student._count++
        this.id = Student._count
        this.firstName = firstName
        this.lastName = lastName
        this.createdAt = Date.now()
    }

}

class StudentStore {
    private students: Student[] = []

    public add(student: Student): void {
        this.students.push(student)
    }

    public list(): readonly Student[] {
        return this.students
    }
    public size(): number {
        return this.students.length
    }
}

class App {
    private firstNameEl: HTMLInputElement
    private lastNameEl: HTMLInputElement
    private addBtnEl: HTMLButtonElement
    private counterEl: HTMLSpanElement
    private cardsEl: HTMLDivElement
    private errorEl: HTMLDivElement

    constructor(private store: StudentStore){
        this.firstNameEl = this.must<HTMLInputElement>("#firstName")
        this.lastNameEl = this.must<HTMLInputElement>("#lastName")
        this.addBtnEl = this.must<HTMLButtonElement>("#addBtn")
        this.counterEl = this.must<HTMLSpanElement>("#counter")
        this.cardsEl = this.must<HTMLDivElement>("#cards")
        this.errorEl = this.must<HTMLDivElement>("#error")

        this.addBtnEl.addEventListener("click", () => this.onAdd())
    }
    private onAdd(): void {
        const firstNameValue = this.normalize(this.firstNameEl.value)
        const lastNameValue = this.normalize(this.lastNameEl.value)

        if (!firstNameValue || !lastNameValue) {
            this.setError("Не хватает имени или фамилии")
            return
        }
        this.setError("")
        const student = new Student(firstNameValue, lastNameValue)
        this.store.add(student)

        this.render()
    }
    private setError(msg: string){
        this.errorEl.textContent = msg
    }
    private normalize(s: string): string {
        return s.trim().replace(/\s+/g, "")
    }
    private must<T extends Element>(selector: string): T {
        const el = document.querySelector(selector)
        if (!el) throw new Error(`Элемент ${selector} не найден`)
        return el as T
    }

    private render(): void {
        this.counterEl.textContent = String(Student._count)
        for (const st of this.store.list()){
            const card = document.createElement("div")
            card.className = "card"

            const name = document.createElement("div")
            name.className = "name"
            name.textContent = `${st.firstName} ${st.lastName}`

            card.append(name)
            this.cardsEl.append(card)
        }
    }
}

new App(new StudentStore())
