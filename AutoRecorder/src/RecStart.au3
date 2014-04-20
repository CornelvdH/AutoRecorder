; Auto Recorder - Starter for Adobe Audition.
; Author: Cornel van der Heiden

; Get the window handle for the Audition application.
Local $hWnd = WinWait("[CLASS:audition5]", "", 0)
; Activate the window handle so we get full focus.
WinActivate($hWnd)
; Sleep a little while so we are sure we focussed right.
Sleep(100)
; Ctrl + Shift + N sent to create a new file.
Send("^N")
; Wait a bit.
Sleep(100)
; Double Enter-tapping dismisses the dialog.
Send("{ENTER}")
Send("{ENTER}")
; Wait a bit.
Sleep(100)
; Start the recording by using Shift + Space (check keyboard shortcuts if you use non-default settings)
Send("+{SPACE}")
