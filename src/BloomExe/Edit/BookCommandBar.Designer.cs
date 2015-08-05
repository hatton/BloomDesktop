namespace Bloom.Edit
{
	partial class BookCommandBar
	{
		/// <summary> 
		/// Required designer variable.
		/// </summary>
		private System.ComponentModel.IContainer components = null;

		/// <summary> 
		/// Clean up any resources being used.
		/// </summary>
		/// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
		protected override void Dispose(bool disposing)
		{
			if(disposing && (components != null))
			{
				components.Dispose();
			}
			base.Dispose(disposing);
		}

		#region Component Designer generated code

		/// <summary> 
		/// Required method for Designer support - do not modify 
		/// the contents of this method with the code editor.
		/// </summary>
		private void InitializeComponent()
		{
			this.components = new System.ComponentModel.Container();
			this._updateAvailabilityTimer = new System.Windows.Forms.Timer(this.components);
			this.SuspendLayout();
			// 
			// _updateAvailabilityTimer
			// 
			this._updateAvailabilityTimer.Interval = 500;
			this._updateAvailabilityTimer.Tick += new System.EventHandler(this._updateAvailabilityTimer_Tick);
			// 
			// BookCommandBar
			// 
			this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
			this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
			this.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(255)))), ((int)(((byte)(255)))), ((int)(((byte)(192)))));
			this.Name = "BookCommandBar";
			this.Size = new System.Drawing.Size(206, 50);
			this.Load += new System.EventHandler(this.BookCommandBar_Load);
			this.ResumeLayout(false);

		}

		#endregion

		private System.Windows.Forms.Timer _updateAvailabilityTimer;
	}
}
