export default function Footer() {
  return (
    <footer className="py-12 px-4 bg-card/50 backdrop-blur-sm border-t border-border">

      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-serif text-2xl mb-4 text-foreground">Рестораны</h3>
            <p className="text-muted-foreground leading-relaxed">
              Вайнахская, восточная и европейская кухня
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Контакты</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>+7 905 977-57-00</li>
             </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Социальные сети</h4>
            <ul className="space-y-2 text-muted-foreground">
              <a href='https://www.instagram.com/bashnya_rest?igsh=MXQ3ZzduNnluaXV3'>Instagram</a>
             </ul>
          </div>
        </div>
        <div className="text-center text-muted-foreground text-sm pt-8 border-t border-border">
          © 2025 Рестораны. Все права защищены.
        </div>
      </div>
    </footer>
  )
}
