interface FooterProps extends React.HTMLAttributes<HTMLElement> {}

function Footer({ children }: FooterProps) {
  return <footer className='bg-slate-700'>{children}</footer>
}

export default Footer
