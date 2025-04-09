export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background py-6">
      <div className="container text-center">
        <p className="text-sm text-muted-foreground">RecipeGen © {new Date().getFullYear()}</p>
      </div>
    </footer>
  )
}

