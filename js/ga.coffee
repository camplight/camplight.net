_gaq = _gaq || []
_gaq.push ['_setAccount', 'UA-27240300-1']
_gaq.push ['_trackPageview']

->
  ga = document.createElement 'script'
  ga.type = 'text/javascript'
  ga.async = true
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js'
  s = document.getElementsByTagName('script')[0] 
  s.parentNode.insertBefore(ga, s)

