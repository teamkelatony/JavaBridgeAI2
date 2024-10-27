package com.google.appinventor.client.commands;

import com.google.appinventor.client.Ode;
import com.google.appinventor.client.explorer.commands.ChainableCommand;
import com.google.appinventor.client.explorer.commands.SaveAllEditorsCommand;
import com.google.appinventor.client.tracking.Tracking;
import com.google.appinventor.client.utils.Downloader;
import com.google.appinventor.shared.rpc.ServerLayout;
import com.google.appinventor.shared.rpc.project.ProjectRootNode;
import com.google.gwt.user.client.Command;

public class GenerateJavaCommand implements Command {
  @Override
  public void execute() {
    final ProjectRootNode projectRootNode = Ode.getInstance().getCurrentYoungAndroidProjectRootNode();
    if (projectRootNode != null) {
      final long projectId = Ode.getInstance().getCurrentYoungAndroidProjectId();
      final String projectName = Ode.getInstance().getCurrentYoungAndroidProjectRootNode().getName();
      final String javaFileName = Ode.getInstance().getCurrentFileEditor().getFileNode().getName().replace(".scm", "").replace(".bky", "") + ".java";
      final String userName = Ode.getInstance().getUser().getUserId();

      //generate and download java file
      ChainableCommand cmd = new SaveAllEditorsCommand(new com.google.appinventor.client.explorer.commands.GenerateJavaCommand(null));
      cmd.startExecuteChain(Tracking.PROJECT_ACTION_BUILD_YAIL_YA, projectRootNode,
              new Command() {
                @Override
                public void execute() {
                  Downloader.getInstance().download(ServerLayout.downloadJavaFilePath(projectId, userName, projectName, javaFileName));
                }
              });
    }
  }
}
