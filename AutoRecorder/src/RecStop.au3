; Auto Recorder - Starter for Adobe Audition.
; Author: Cornel van der Heiden

; Get the window handle for the Audition application.
Local $hWnd = WinWait("[CLASS:audition5]", "", 0)
; Activate the window handle so we get full focus.
WinActivate($hWnd)
; Wait a bit for focus.
Sleep(100)
; Send a "stop recording" signal by emulating the spacebar press.
Send("{SPACE}")
; Press Ctrl + S for saving.
Send("^s")
; Use the first argument on the command line (check main.js for more).
Send($CmdLine[1])
; Send double Enter to dismiss the dialog.
Send("{ENTER}")
Send("{ENTER}")
; File saved, script terminates.