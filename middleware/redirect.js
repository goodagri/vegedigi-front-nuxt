export default function (context) {
  if(context.$auth.loggedIn) {
    context.redirect('/')
  }
}